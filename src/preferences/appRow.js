/* exported AppRow, CustomRow, AddAppRow */

const {
  GObject: { registerClass: GObjectClass },
  Gdk,
  Gtk
} = imports.gi;

const C_gtk30_ = imports.gettext.domain('gtk30').pgettext;
const gtk30_ = imports.gettext.domain('gtk30').gettext;

/* Translated and modified from gnome-tweak-tool's StartupTweak.py */
// TODO: Transition UI to XML.

@GObjectClass
class AppRow extends Gtk.ListBoxRow {
  _init(app_info, on_configure, on_remove) {
    super._init();

    this.on_configure = on_configure;
    this.on_remove = on_remove;
    this.app_name = app_info.get_name();
    this.app_id = app_info.get_id();

    let grid = new Gtk.Grid({ column_spacing: 10 });

    let icn = app_info.get_icon();
    let img = null;

    if (typeof icn !== 'undefined' && icn !== null) {
      img = Gtk.Image.new_from_gicon(icn, Gtk.IconSize.MENU);
      grid.attach(img, 0, 0, 1, 1);
    }

    let lbl = new Gtk.Label({ label: app_info.get_name(), xalign: 0.0 });
    grid.attach_next_to(lbl, img, Gtk.PositionType.RIGHT, 1, 1);
    lbl.hexpand = true;
    lbl.halign = Gtk.Align.START;
    let btn = Gtk.Button.new_with_mnemonic(C_gtk30_('Action name', 'Edit'));
    grid.attach_next_to(btn, lbl, Gtk.PositionType.RIGHT, 1, 1);
    btn.vexpand = false;
    btn.valign = Gtk.Align.CENTER;
    this.btn = btn;
    this.btn.connect('clicked', this.configure.bind(this));

    let remove_btn = Gtk.Button.new_with_mnemonic(gtk30_('_Remove'));
    grid.attach_next_to(remove_btn, btn, Gtk.PositionType.RIGHT, 1, 1);
    remove_btn.vexpand = false;
    remove_btn.valign = Gtk.Align.CENTER;
    this.remove_btn = remove_btn;
    this.remove_btn.connect('clicked', this.remove.bind(this));

    this.add(grid);
    this.margin_start = 1;
    this.margin_end = 1;
    this.connect('key-press-event', this.on_key_press_event.bind(this));
  }

  on_key_press_event(row, event) {
    if (
      event.keyval === Gdk.KEY_Delete ||
      event.keyval === Gdk.KEY_KP_Delete ||
      event.keyval === Gdk.KEY_BackSpace
    ) {
      this.remove_btn.activate();
      return true;
    }
    return false;
  }

  configure() {
    this.on_configure.call(this, this.app_name, this.app_id);
  }

  remove() {
    this.on_remove.call(this, this.app_id, this);
  }
}

@GObjectClass
class CustomRow extends Gtk.ListBoxRow {
  _init(name, wm_class, on_configure, on_remove, wm_class_extra = []) {
    super._init();

    this.on_configure = on_configure;
    this.on_remove = on_remove;
    this.app_name = wm_class;
    this.app_id = wm_class;
    this.wm_class = wm_class;
    this.wm_class_extra = wm_class_extra;
    this.name = name;

    let grid = new Gtk.Grid({ column_spacing: 10 });

    let lbl = new Gtk.Label({ label: this.name, xalign: 0.0 });
    grid.attach(lbl, 0, 0, 1, 1);
    lbl.hexpand = true;
    lbl.halign = Gtk.Align.START;
    let btn = Gtk.Button.new_with_mnemonic(C_gtk30_('Action name', 'Edit'));
    grid.attach_next_to(btn, lbl, Gtk.PositionType.RIGHT, 1, 1);
    btn.vexpand = false;
    btn.valign = Gtk.Align.CENTER;
    this.btn = btn;
    this.btn.connect('clicked', this.configure.bind(this));

    let remove_btn = Gtk.Button.new_with_mnemonic(gtk30_('_Remove'));
    grid.attach_next_to(remove_btn, btn, Gtk.PositionType.RIGHT, 1, 1);
    remove_btn.vexpand = false;
    remove_btn.valign = Gtk.Align.CENTER;
    this.remove_btn = remove_btn;
    this.remove_btn.connect('clicked', this.remove.bind(this));

    this.add(grid);
    this.margin_start = 1;
    this.margin_end = 1;
    this.connect('key-press-event', this.on_key_press_event.bind(this));
  }

  on_key_press_event(row, event) {
    if (
      event.keyval === Gdk.KEY_Delete ||
      event.keyval === Gdk.KEY_KP_Delete ||
      event.keyval === Gdk.KEY_BackSpace
    ) {
      this.remove_btn.activate();
      return true;
    }
    return false;
  }

  configure() {
    this.on_configure.call(this, this.name, this.wm_class, this.wm_class_extra);
  }

  remove() {
    this.on_remove.call(this, this.wm_class, this, this.wm_class_extra);
  }
}

@GObjectClass
class AddAppRow extends Gtk.ListBoxRow {
  _init(options) {
    super._init();
    let img = new Gtk.Image();
    img.set_from_icon_name('list-add-symbolic', Gtk.IconSize.BUTTON);
    this.btn = new Gtk.Button({
      label: '',
      image: img,
      always_show_image: true
    });
    this.btn.get_style_context().remove_class('button');
    this.add(this.btn);
  }
}